#!/usr/bin/env python3
"""
艺术作品集预处理脚本
功能：
1. 压缩 src/ 目录下的图片到 images/ 目录
2. 生成 data/works.json 作品元数据文件
3. 支持批量处理和交互式编辑

使用方法：
    python3 preprocess.py
"""

import os
import json
from pathlib import Path
from datetime import datetime
import sys

# 尝试导入 Pillow
try:
    from PIL import Image
except ImportError:
    print("❌ 错误: 需要安装 Pillow 库")
    print("请运行: pip install Pillow")
    sys.exit(1)

# ========================================
# 配置
# ========================================
CONFIG = {
    # 目录配置
    'src_dir': './src',           # 原始图片目录
    'output_dir': './images',      # 输出图片目录
    'data_dir': './data',          # 数据目录
    
    # 图片压缩配置
    'max_width': 1920,             # 最大宽度
    'max_height': 1080,            # 最大高度
    'quality': 85,                 # JPEG 质量 (1-100)
    'output_format': 'JPEG',       # 输出格式
    'output_ext': '.jpg',          # 输出扩展名
    
    # 默认作品信息
    'defaults': {
        'category': 'photography',  # 默认类别: photography | painting
        'price': 0,                 # 默认价格
    }
}

# ========================================
# 辅助函数
# ========================================
def print_header(text):
    """打印标题"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def print_info(text):
    """打印信息"""
    print(f"ℹ️  {text}")

def print_success(text):
    """打印成功信息"""
    print(f"✅ {text}")

def print_warning(text):
    """打印警告信息"""
    print(f"⚠️  {text}")

def print_error(text):
    """打印错误信息"""
    print(f"❌ {text}")

def ensure_dir(path):
    """确保目录存在"""
    Path(path).mkdir(parents=True, exist_ok=True)

def get_file_size(filepath):
    """获取文件大小（可读格式）"""
    try:
        size = os.path.getsize(filepath)
    except:
        size = 0
    return format_size(size)

def format_size(size):
    """格式化字节大小为可读格式"""
    if size == 0:
        return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"

# ========================================
# 图片处理函数
# ========================================
def compress_image(input_path, output_path, config):
    """
    压缩图片
    
    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径
        config: 配置字典
    
    Returns:
        (success, original_size, compressed_size, ratio)
    """
    try:
        # 打开图片
        with Image.open(input_path) as img:
            original_size = os.path.getsize(input_path)
            
            # 转换 RGB 模式（JPEG 不支持 RGBA）
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # 计算缩放比例
            width, height = img.size
            max_width = config['max_width']
            max_height = config['max_height']
            
            if width > max_width or height > max_height:
                ratio = min(max_width / width, max_height / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # 保存压缩后的图片
            img.save(output_path, 
                    format=config['output_format'], 
                    quality=config['quality'],
                    optimize=True)
            
            compressed_size = os.path.getsize(output_path)
            ratio = (1 - compressed_size / original_size) * 100
            
            return True, original_size, compressed_size, ratio
            
    except Exception as e:
        print_error(f"压缩图片失败: {e}")
        return False, 0, 0, 0

# ========================================
# 数据处理函数
# ========================================
def load_metadata(metadata_path):
    """加载作品元数据"""
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'works': []}

def save_metadata(metadata_path, data):
    """保存作品元数据"""
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_existing_works(metadata):
    """获取已存在的作品列表"""
    return {work['filename'] for work in metadata.get('works', [])}

def input_work_info(filename):
    """
    交互式输入作品信息
    
    Args:
        filename: 文件名
    
    Returns:
        作品信息字典
    """
    print(f"\n📸 处理图片: {filename}")
    print("-" * 40)
    
    # 标题
    default_title = filename.rsplit('.', 1)[0]
    title = input(f"作品标题 [{default_title}]: ").strip()
    if not title:
        title = default_title
    
    # 类别
    print("\n可选类别:")
    print("  1. photography (摄影作品)")
    print("  2. painting (绘画作品)")
    category_choice = input(f"选择类别 [1]: ").strip()
    
    if category_choice == '2':
        category = 'painting'
    else:
        category = 'photography'
    
    # 描述
    print_info("提示: 留空则跳过描述")
    description = input("作品描述: ").strip()
    if not description:
        description = ""
    
    # 价格
    print_info("提示: 输入 0 表示不展示价格")
    price_input = input(f"价格 (元) [0]: ").strip()
    try:
        price = int(price_input) if price_input else 0
    except ValueError:
        price = 0
    
    # 日期
    date = datetime.now().strftime('%Y-%m')
    
    work_info = {
        'filename': filename,
        'title': title,
        'category': category,
        'description': description,
        'price': price,
        'date': date
    }
    
    return work_info

def batch_input_work_info(filenames):
    """
    批量输入作品信息
    
    Args:
        filenames: 文件名列表
    
    Returns:
        作品信息字典列表
    """
    print_header("批量输入作品信息")
    print_info("为所有图片设置相同的默认信息")
    
    # 批量设置
    default_category = input("默认类别 [photography]: ").strip() or 'photography'
    default_price_input = input("默认价格 (元) [0]: ").strip()
    try:
        default_price = int(default_price_input) if default_price_input else 0
    except ValueError:
        default_price = 0
    
    # 日期
    date = datetime.now().strftime('%Y-%m')
    
    works = []
    for filename in filenames:
        title = filename.rsplit('.', 1)[0]
        works.append({
            'filename': filename,
            'title': title,
            'category': default_category,
            'description': '',
            'price': default_price,
            'date': date
        })
    
    return works

# ========================================
# 主函数
# ========================================
def main():
    print_header("艺术作品集预处理工具")
    
    # 确保目录存在
    ensure_dir(CONFIG['src_dir'])
    ensure_dir(CONFIG['output_dir'])
    ensure_dir(CONFIG['data_dir'])
    
    metadata_path = os.path.join(CONFIG['data_dir'], 'works.json')
    
    # 扫描原始图片
    src_files = []
    supported_ext = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}
    
    for filename in os.listdir(CONFIG['src_dir']):
        ext = os.path.splitext(filename)[1].lower()
        if ext in supported_ext:
            src_files.append(filename)
    
    if not src_files:
        print_warning("src/ 目录下没有找到图片文件")
        print_info("请将原始图片放入 src/ 目录后重试")
        return
    
    print_info(f"找到 {len(src_files)} 张图片")
    
    # 加载已存在的元数据
    metadata = load_metadata(metadata_path)
    existing_works = get_existing_works(metadata)
    
    # 检查已存在的文件
    new_files = [f for f in src_files if f not in existing_works]
    existing_files = [f for f in src_files if f in existing_works]
    
    if existing_files:
        print_warning(f"以下 {len(existing_files)} 张图片已存在:")
        for f in existing_files[:5]:
            print(f"   - {f}")
        if len(existing_files) > 5:
            print(f"   ... 还有 {len(existing_files) - 5} 张")
    
    if new_files:
        print_success(f"发现 {len(new_files)} 张新图片待处理")
    
    # 选择处理模式
    print("\n处理模式:")
    print("  1. 逐张处理 (交互式输入每张图片的信息)")
    print("  2. 批量处理 (使用默认信息)")
    print("  3. 重新处理所有 (覆盖已存在的图片)")
    
    choice = input("\n请选择模式 [1]: ").strip()
    
    if choice == '2':
        # 批量处理
        if new_files:
            works = batch_input_work_info(new_files)
            
            for i, work in enumerate(works, 1):
                original_filename = work['filename']  # 原始文件名
                print(f"\n[{i}/{len(works)}] 处理: {original_filename}")
                
                src_path = os.path.join(CONFIG['src_dir'], original_filename)
                output_filename = os.path.splitext(original_filename)[0] + CONFIG['output_ext']
                output_path = os.path.join(CONFIG['output_dir'], output_filename)
                
                # 压缩图片
                success, orig_size, comp_size, ratio = compress_image(src_path, output_path, CONFIG)
                
                if success:
                    works[i-1]['filename'] = output_filename  # 更新为输出文件名
                    orig_size_str = get_file_size(src_path)  # 获取原始文件大小的可读格式
                    comp_size_str = get_file_size(output_path)  # 获取压缩后文件大小的可读格式
                    print_success(f"压缩成功: {orig_size_str} → {comp_size_str} (节省 {ratio:.1f}%)")
                else:
                    print_error(f"压缩失败: {original_filename}")
            
            # 更新元数据
            metadata['works'].extend(works)
            metadata['works'].sort(key=lambda x: x['filename'], reverse=True)
            save_metadata(metadata_path, metadata)
            print_success(f"成功处理 {len(works)} 张图片")
        else:
            print_warning("没有新图片需要处理")
    
    elif choice == '3':
        # 重新处理所有
        confirm = input("确认重新处理所有图片？将覆盖已存在的图片 (y/N): ").strip().lower()
        if confirm == 'y':
            works = batch_input_work_info(src_files)
            
            metadata['works'] = []
            
            for i, work in enumerate(works, 1):
                original_filename = work['filename']  # 原始文件名
                print(f"\n[{i}/{len(works)}] 处理: {original_filename}")
                
                src_path = os.path.join(CONFIG['src_dir'], original_filename)
                output_filename = os.path.splitext(original_filename)[0] + CONFIG['output_ext']
                output_path = os.path.join(CONFIG['output_dir'], output_filename)
                
                success, orig_size, comp_size, ratio = compress_image(src_path, output_path, CONFIG)
                
                if success:
                    works[i-1]['filename'] = output_filename  # 更新为输出文件名
                    orig_size_str = get_file_size(src_path)  # 获取原始文件大小的可读格式
                    comp_size_str = get_file_size(output_path)  # 获取压缩后文件大小的可读格式
                    print_success(f"压缩成功: {orig_size_str} → {comp_size_str} (节省 {ratio:.1f}%)")
                else:
                    print_error(f"压缩失败: {original_filename}")
            
            metadata['works'] = works
            metadata['works'].sort(key=lambda x: x['filename'], reverse=True)
            save_metadata(metadata_path, metadata)
            print_success(f"成功处理 {len(works)} 张图片")
    
    else:
        # 逐张处理
        files_to_process = new_files if new_files else existing_files
        
        if not files_to_process:
            print_warning("没有图片需要处理")
            return
        
        for i, filename in enumerate(files_to_process, 1):
            print(f"\n进度: [{i}/{len(files_to_process)}]")
            
            src_path = os.path.join(CONFIG['src_dir'], filename)
            output_filename = os.path.splitext(filename)[0] + CONFIG['output_ext']
            output_path = os.path.join(CONFIG['output_dir'], output_filename)
            
            # 输入作品信息
            work_info = input_work_info(filename)
            work_info['filename'] = output_filename
            
            # 压缩图片
            success, orig_size, comp_size, ratio = compress_image(src_path, output_path, CONFIG)
            
            if success:
                print_success(f"压缩成功: {get_file_size(orig_size)} → {get_file_size(comp_size)} (节省 {ratio:.1f}%)")
                
                # 更新元数据
                if filename in existing_works:
                    # 更新已存在的
                    for j, work in enumerate(metadata['works']):
                        if work['filename'] == output_filename:
                            metadata['works'][j] = work_info
                            break
                else:
                    # 添加新的
                    metadata['works'].append(work_info)
            else:
                print_error(f"压缩失败: {filename}")
        
        # 排序并保存
        metadata['works'].sort(key=lambda x: x['filename'], reverse=True)
        save_metadata(metadata_path, metadata)
        print_success(f"成功处理 {len(files_to_process)} 张图片")
    
    # 显示统计信息
    print_header("处理完成")
    print_info(f"图片总数: {len(metadata['works'])} 张")
    
    # 计算总大小（只统计存在的文件）
    total_size = 0
    for w in metadata['works']:
        filepath = os.path.join(CONFIG['output_dir'], w['filename'])
        if os.path.exists(filepath):
            try:
                total_size += os.path.getsize(filepath)
            except:
                pass
    
    print_info(f"总大小: {format_size(total_size)}")
    print_success(f"元数据文件: {metadata_path}")
    print_success(f"图片目录: {CONFIG['output_dir']}/")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  用户中断操作")
        sys.exit(0)

# 原始图片目录

此目录用于放置待处理的原始图片。

## 使用方法

1. 将您的原始图片文件（jpg、png、gif、bmp、webp）放入此目录
2. 返回项目根目录，运行预处理脚本：
   ```bash
   python3 preprocess.py
   ```
3. 按照脚本提示输入作品信息
4. 脚本会自动：
   - 压缩图片到合适的尺寸（最大 1920x1080）
   - 保存到 `images/` 目录
   - 生成 `data/works.json` 元数据文件

## 注意事项

- 支持的图片格式：JPG、JPEG、PNG、GIF、BMP、WEBP
- 所有输出图片将统一转换为 JPEG 格式
- 建议原始图片分辨率不小于 1920x1080，以保证压缩后的质量
- 处理后的图片文件名会自动转换为 .jpg 扩展名

## 示例

假设您有以下图片：
```
src/
  ├── my-photo.jpg
  └── my-painting.png
```

运行脚本后，会生成：
```
images/
  ├── my-photo.jpg      (压缩后)
  └── my-painting.jpg   (压缩后，格式转换)

data/
  └── works.json        (元数据文件)
```

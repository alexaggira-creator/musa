import os
from PIL import Image

directories = ['Lenceria', 'PIJAMAS']

for directory in directories:
    if not os.path.exists(directory):
        continue
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(directory, filename)
            # generate webp name
            name = os.path.splitext(filename)[0]
            webp_path = os.path.join(directory, f"{name}.webp")
            
            try:
                img = Image.open(filepath)
                # Ensure it has RGB mode to save as webp
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                # save as webp
                img.save(webp_path, 'webp', quality=85)
                # remove old file
                os.remove(filepath)
                print(f"Converted: {filename} -> {name}.webp")
            except Exception as e:
                print(f"Failed to convert {filename}: {e}")

print("All done!")

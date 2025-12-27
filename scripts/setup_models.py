import os
import sys
import subprocess
import urllib.request
import shutil

# Configuration: Model URLs and Target Paths
MODELS = {
    "diffusion": {
        "url": "https://huggingface.co/gguf-org/z-image-gguf/resolve/main/z-image-turbo-q3_k_s.gguf",
        "filename": "z-image-turbo-q3_k_s.gguf",
        "rel_path": os.path.join("models", "diffusion_models")
    },
    "text_encoder": {
        "url": "https://huggingface.co/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf",
        "filename": "Qwen3-4B-Q4_K_M.gguf",
        "rel_path": os.path.join("models", "text_encoders")
    },
    "vae": {
        "url": "https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors",
        "filename": "ae.safetensors",
        "rel_path": os.path.join("models", "vae")
    }
}

CUSTOM_NODE_URL = "https://github.com/city96/ComfyUI-GGUF.git"
CUSTOM_NODE_NAME = "ComfyUI-GGUF"

def print_colored(text, color_code):
    if sys.platform == "win32":
        print(text)
    else:
        print(f"\033[{color_code}m{text}\033[0m")

def info(text):
    print_colored(f"[INFO] {text}", "36") # Cyan

def success(text):
    print_colored(f"[SUCCESS] {text}", "32") # Green

def warning(text):
    print_colored(f"[WARNING] {text}", "33") # Yellow

def error(text):
    print_colored(f"[ERROR] {text}", "31") # Red

def get_comfy_path():
    print("----------------------------------------------------------------")
    print("Welcome to the OutfitGenie Auto-Installer!")
    print("This script will install the required Custom Nodes and Models.")
    print("----------------------------------------------------------------")

    default_path = os.path.join(os.getcwd(), "ComfyUI")
    if os.path.exists(default_path):
        use_default = input(f"Found ComfyUI at '{default_path}'. Use this? [Y/n]: ").strip().lower()
        if use_default in ['', 'y', 'yes']:
            return default_path

    while True:
        path = input("Please enter the full path to your 'ComfyUI' folder: ").strip()
        # Remove quotes if user copied as path
        path = path.strip('"').strip("'")

        if os.path.exists(path) and os.path.isdir(path):
            # rudimentary check
            if os.path.exists(os.path.join(path, "custom_nodes")) and os.path.exists(os.path.join(path, "models")):
                return path
            else:
                warning("That folder exists but doesn't look like a valid ComfyUI installation (missing 'custom_nodes' or 'models').")
                confirm = input("Use it anyway? [y/N]: ").strip().lower()
                if confirm == 'y':
                    return path
        else:
            error(f"Directory not found: {path}")

def install_custom_node(comfy_path):
    nodes_dir = os.path.join(comfy_path, "custom_nodes")
    target_dir = os.path.join(nodes_dir, CUSTOM_NODE_NAME)

    info(f"Checking for {CUSTOM_NODE_NAME}...")

    if os.path.exists(target_dir):
        success(f"{CUSTOM_NODE_NAME} is already installed. Skipping.")
        # Optional: could run 'git pull' here if desired
    else:
        info(f"Cloning {CUSTOM_NODE_NAME}...")
        try:
            subprocess.run(["git", "clone", CUSTOM_NODE_URL, target_dir], check=True)
            success(f"Installed {CUSTOM_NODE_NAME} successfully.")
        except subprocess.CalledProcessError:
            error("Failed to clone repository. Do you have git installed?")
        except FileNotFoundError:
            error("Git command not found. Please install Git.")

def download_file(url, dest_path, description):
    if os.path.exists(dest_path):
        # Optional: Check file size if needed, but simple existence check is usually enough for "resume/skip" logic
        # size = os.path.getsize(dest_path)
        success(f"{description} already exists at {dest_path}. Skipping download.")
        return

    info(f"Downloading {description}...")
    info(f"URL: {url}")

    try:
        # Progress bar hook
        def reporthook(blocknum, blocksize, totalsize):
            readso_far = blocknum * blocksize
            if totalsize > 0:
                percent = readso_far * 1e2 / totalsize
                s = "\r%5.1f%% %*d / %d" % (
                    percent, len(str(totalsize)), readso_far, totalsize)
                sys.stderr.write(s)
                if readso_far >= totalsize: # near the end
                    sys.stderr.write("\n")

        urllib.request.urlretrieve(url, dest_path, reporthook)
        success(f"Downloaded {description}.")
    except Exception as e:
        error(f"Failed to download {description}: {str(e)}")

def install_models(comfy_path):
    for key, data in MODELS.items():
        target_dir = os.path.join(comfy_path, data["rel_path"])
        if not os.path.exists(target_dir):
            os.makedirs(target_dir, exist_ok=True)

        dest_path = os.path.join(target_dir, data["filename"])
        download_file(data["url"], dest_path, f"{key} model ({data['filename']})")

def main():
    try:
        comfy_path = get_comfy_path()
        print("")

        # 1. Install Custom Node
        install_custom_node(comfy_path)
        print("")

        # 2. Download Models
        install_models(comfy_path)

        print("")
        print("----------------------------------------------------------------")
        success("Installation Complete!")
        print("1. Restart ComfyUI if it is running.")
        print("2. Refresh your web browser.")
        print("3. Start creating outfits!")
        print("----------------------------------------------------------------")

    except KeyboardInterrupt:
        print("\nSetup cancelled.")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
火山方舟 Seedream 文生图 / 图生图 命令行工具。
只用 Python 标准库，零依赖。

用法:
  python scripts/ark_image.py -p "提示词" --size 2560x1440 -o output/hero.jpg
  python scripts/ark_image.py -p "提示词" --image ref.jpg --size 2048x2048 -o out.png

API Key 优先级: --key 参数 > 环境变量 ARK_API_KEY。
"""

import argparse
import base64
import json
import os
import sys
import urllib.request
import urllib.error
import urllib.parse


ENDPOINT = "https://ark.cn-beijing.volces.com/api/plan/v3/images/generations"
DEFAULT_MODEL = "doubao-seedream-5.0-lite"

# 满足 >= 3,686,400 px 要求的常用尺寸映射
SIZE_MAP = {
    "3:4": "1664x2496",
    "4:3": "2496x1664",
    "1:1": "2048x2048",
    "16:9": "2560x1440",
    "9:16": "1440x2560",
}


def file_to_dataurl(path: str) -> str:
    ext = os.path.splitext(path)[1].lower().lstrip(".")
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
            "webp": "image/webp", "gif": "image/gif"}.get(ext, "image/jpeg")
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def generate(api_key: str, prompt: str, size: str, model: str, n: int,
             image: str | None = None, seed: int | None = None,
             response_format: str = "url") -> dict:
    payload: dict = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "response_format": response_format,
        "n": n,
    }
    if image is not None:
        # 本地路径 -> base64 dataURL；http(s) 开头的保留为 URL
        if image.startswith("http://") or image.startswith("https://"):
            payload["image"] = image
        else:
            payload["image"] = file_to_dataurl(image)
    if seed is not None:
        payload["seed"] = seed

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(ENDPOINT, data=body, method="POST",
                                 headers={
                                     "Content-Type": "application/json",
                                     "Authorization": f"Bearer {api_key}",
                                 })
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {e.code}: {err}") from e


def download_image(url: str, out_path: str) -> None:
    os.makedirs(os.path.dirname(os.path.abspath(out_path)) or ".", exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as resp, open(out_path, "wb") as f:
        # 8 KB 缓冲，流式写盘
        while chunk := resp.read(8192):
            f.write(chunk)


def main() -> None:
    p = argparse.ArgumentParser(description="火山方舟 Seedream 图像生成工具")
    p.add_argument("-p", "--prompt", required=True, help="提示词")
    p.add_argument("--size", default="2048x2048",
                   help="尺寸，如 2560x1440，或比例别名 16:9/1:1 等 (默认 2048x2048)")
    p.add_argument("--model", default=DEFAULT_MODEL, help="模型名")
    p.add_argument("-n", "--num", type=int, default=1, help="生成数量")
    p.add_argument("--image", default=None, help="图生图参考图（本地路径或 URL）")
    p.add_argument("--seed", type=int, default=None, help="随机种子")
    p.add_argument("-o", "--out", required=True, help="输出路径；多张会加 -1/-2 后缀")
    p.add_argument("--key", default=None, help="API Key，默认取 ARK_API_KEY 环境变量")
    args = p.parse_args()

    api_key = args.key or os.environ.get("ARK_API_KEY")
    if not api_key:
        sys.exit("错误: 未提供 API Key。请用 --key 或设置 ARK_API_KEY 环境变量。")

    size = SIZE_MAP.get(args.size, args.size)
    if "x" not in size:
        sys.exit(f"错误: 尺寸 '{size}' 格式不对，应为 WIDTHxHEIGHT")

    print(f"调用 Seedream，size={size}，model={args.model}，n={args.num}")
    print(f"prompt: {args.prompt[:120]}{'...' if len(args.prompt) > 120 else ''}")

    result = generate(api_key, args.prompt, size, args.model, args.num,
                      image=args.image, seed=args.seed)

    data = result.get("data", [])
    if not data:
        sys.exit(f"错误: 返回数据为空。完整响应: {result}")

    base, ext = os.path.splitext(args.out)
    if not ext:
        ext = ".png"

    for i, item in enumerate(data, 1):
        suffix = f"-{i}" if len(data) > 1 else ""
        out_path = f"{base}{suffix}{ext}"
        url = item.get("url")
        if url:
            print(f"下载 {i}/{len(data)} -> {out_path}")
            download_image(url, out_path)
        else:
            b64 = item.get("b64_json")
            if b64:
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(b64))
                print(f"保存 {i}/{len(data)} -> {out_path}")
        seed = item.get("seed")
        if seed is not None:
            print(f"  seed: {seed}")

    print("完成。")


if __name__ == "__main__":
    main()

const SIZE_UNITS = ["KB", "MB", "GB"] as const;

export function formatSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 KB";
    }

    let size = bytes / 1024;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < SIZE_UNITS.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    const formattedSize =
        size >= 10 || Number.isInteger(size) ? size.toFixed(0) : size.toFixed(1);

    return `${formattedSize} ${SIZE_UNITS[unitIndex]}`;
}

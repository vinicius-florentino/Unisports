export default function stringAvatar(name) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("");

    return {
        children: initials.toUpperCase(),
    };
}
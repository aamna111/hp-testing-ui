function Avatar({ initials, gradient, size = "md" }) {
  const sizes = { sm: "w-9 h-9 text-sm", md: "w-12 h-12 text-base", lg: "w-14 h-14 text-lg" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default Avatar;
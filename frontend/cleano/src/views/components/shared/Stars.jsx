// ============================================================
// src/views/components/shared/Stars.jsx
// ============================================================
const Stars = ({ rating, size = 14 }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const style = { fontSize: size, lineHeight: 1, display: "inline-flex", gap: 1 };

  return (
    <span style={style} aria-label={`${rating} sur 5`}>
      {"★".repeat(full)}
      {half && "½"}
      <span style={{ opacity: .3 }}>{"★".repeat(empty)}</span>
    </span>
  );
};

export default Stars;

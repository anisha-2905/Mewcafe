function BottomPanel({ title, children }) {
  return (
    <section className="bottom-panel glass-panel" aria-label={title}>
      <h2>{title}</h2>
      <div className="bottom-panel__body">{children}</div>
    </section>
  );
}

export default BottomPanel;

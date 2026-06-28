import IconButton from './IconButton.jsx';

function TitleBar() {
  const controls = window.mewcafe?.windowControls;

  return (
    <header className="title-bar">
      <div className="title-bar__brand">
        <span className="title-bar__mark" aria-hidden="true">M</span>
        <span>MewCafe</span>
      </div>

      <nav className="title-bar__actions" aria-label="Window controls">
        <IconButton label="Minimize" icon="-" onClick={() => controls?.minimize()} />
        <IconButton label="Maximize" icon="□" onClick={() => controls?.maximize()} />
        <IconButton
          label="Close"
          icon="×"
          className="icon-button--danger"
          onClick={() => controls?.close()}
        />
      </nav>
    </header>
  );
}

export default TitleBar;

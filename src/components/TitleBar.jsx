import IconButton from './IconButton.jsx';

const windowIcons = {
  maximize: String.fromCharCode(0x25a1),
  close: String.fromCharCode(0x00d7)
};

function TitleBar() {
  const controls = window.mewcafe?.windowControls;

  return (
    <header className="title-bar">
      <div className="title-bar__brand">
        <img src="./favicon.png" alt="" className="title-bar__icon" />
        <span>MewCafe</span>
      </div>

      <nav className="title-bar__actions" aria-label="Window controls">
        <IconButton label="Minimize" icon="-" onClick={() => controls?.minimize()} />
        <IconButton label="Maximize" icon={windowIcons.maximize} onClick={() => controls?.maximize()} />
        <IconButton
          label="Close"
          icon={windowIcons.close}
          className="icon-button--danger"
          onClick={() => controls?.close()}
        />
      </nav>
    </header>
  );
}

export default TitleBar;

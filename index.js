exports.NetworkMod = function comboUI(mod) {
  if (!global.TeraProxy.GUIMode)
    throw new Error('Proxy GUI is not running!');

  const { Host } = require('tera-mod-ui');
  const path = require("path")
  let ui = new Host(mod, 'index.html', {
    title: 'edgeui',
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    skipTaskBar: false,
    width: mod.settings.windowSize[0],
    height: mod.settings.windowSize[1],
    resizable: true,
    center: true,
    x: mod.settings.windowPos[0],
    y: mod.settings.windowPos[1],
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: { nodeIntegration: true, devTools: false }
  }, false, path.join(__dirname, 'ui'))

  let opened = false,
    focused = null,
    focusChange = true,
    moving = false
  mod.game.on('enter_game', () => { mod.command.exec('hitui') })
  mod.game.on('leave_game', () => { ui.close(); mod.clearAllIntervals() })

  async function moveTop() {
    focused = await mod.clientInterface.hasFocus()
    if (!focused && focusChange && !moving) { ui.hide(); focusChange = false; }
    if (focused && !focusChange) { ui.show(); focusChange = true; }
    if (focused) ui.window.moveTop()
  }

  mod.command.add('hitui', (arg, arg2) => {
    if (!opened && !arg || !opened && ['open', 'gui', 'ui'].includes(arg)) {
      opened = true
      ui.show();
      ui.window.setPosition(mod.settings.windowPos[0], mod.settings.windowPos[1]);
      mod.setTimeout(() => {
        ui.window.setBounds({ width: mod.settings.windowSize[0], height: mod.settings.windowSize[1] })
        ui.send('hitBox', { text: mod.settings.showBorder ? 'on' : 'off' })
      }, 500)
      ui.window.setAlwaysOnTop(true, 'screen-saver', 1);
      ui.window.setVisibleOnAllWorkspaces(true);
      mod.setInterval(() => { moveTop() }, 1000);
      ui.window.on('move', () => { moving = true; })
      ui.window.on('moved', () => { mod.setTimeout(() => { moving = false; }, 500) })
      ui.window.on('resized', () => { mod.setTimeout(() => { moving = false; }, 500) })
      ui.window.on('close', () => { mod.settings.windowPos = ui.window.getPosition(); mod.settings.windowSize = ui.window.getSize(); mod.clearAllIntervals(); opened = false });
    }
    if (arg == 'suffix') {
      mod.settings.suffix = arg2.toString()
      mod.command.message(`suffix set to ${arg2.toString()}`)
      ui.close()
      setTimeout(() => { mod.command.exec('hitui') }, 50);
    }
    if (arg == 'border') {
      mod.settings.showBorder = !mod.settings.showBorder
      ui.send('hitBox', { text: mod.settings.showBorder ? 'on' : 'off' })
    }
  })

  mod.hook('S_HIT_COMBO', 1, { order: -99999 }, (e) => {
    if (!opened) return;
    //if (e.hits == 0) { ui.hide(); return; };
    if (e.hits > 0 && !ui.window.isVisible()) ui.show();
    ui.send('hitUpdate', { text: [e.hits, mod.settings.suffix] })
  })
}

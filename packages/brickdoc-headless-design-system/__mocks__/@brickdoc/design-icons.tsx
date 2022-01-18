export {}

const BYPASSED_EXPORTS: Array<string | symbol> = ['IconProvider', 'DEFAULT_ICON_CONFIGS', 'ImageIcon']
const icons = new Proxy(
  {},
  {
    get(obj: Record<string | symbol, unknown>, key) {
      if (BYPASSED_EXPORTS.includes(key)) {
        return obj[key]
      }
      return () => <i data-mock-icon={key.toString()} />
    }
  }
)
module.exports = icons

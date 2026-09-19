import './CrashFallback.scss'

/**
 * Deliberately shares nothing with the app: no store, no hooks, no village.
 * Whatever broke must not be able to break the way out of it too.
 */
export function CrashFallback() {
  return (
    <div className="crash">
      <h1 className="crash__title">The village fell over.</h1>
      <p className="crash__body">
        The Builder has been told. In the meantime the search bar still works.
      </p>
      <form className="crash__form" action="https://www.google.com/search" method="get">
        <input
          className="crash__input"
          type="text"
          name="q"
          placeholder="Search"
          aria-label="Search"
          autoFocus
        />
      </form>
      <button className="crash__reload" type="button" onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  )
}

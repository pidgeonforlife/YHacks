import icon from '../images/icon.png'
import logo from '../images/logo.png'

const Nav = ({ minimal, authToken, setShowModal, showModal }) => {

  const handleClick = () => {
      setShowModal(true)
  }  

  return (
    <nav>
      <div className='logo-container'>
        <img className='logo'
          src={minimal ? icon : logo}
          alt='logo' />
      </div>

      {!authToken && !minimal && <button 
        className='nav-button'
        onClick={handleClick}
        disabled={showModal}
      >Log in</button>}
    </nav>
  )
}

export default Nav
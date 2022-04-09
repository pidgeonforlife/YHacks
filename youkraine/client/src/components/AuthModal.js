import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthModal = ({ setShowModal, setIsSignUp, isSignUp }) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError("Passwords do not match!")
                return
            }

            const response = await axios.post('http://localhost:8000/signup', { email, password })

            const success = (response.status === 201)
            if (success) navigate('/onboarding')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>X</div>
            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
            <p>By clicking, suck it.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password-check"
                    id="password-check"
                    name="password-check"
                    placeholder="Confirm Password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className='secondary-button' type="submit" />
                <p>{error}</p>

            </form>
            <hr />
            <h2>GET THE APP</h2>
        </div>
    )
}
export default AuthModal
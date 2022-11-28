import { useContext } from 'react'
import { TwitterContext } from '../context/TwitterContext'
import Sidebar from '../components/Sidebar'
import Feed from '../components/home/Feed'
import Widgets from '../components/Widgets'
import Image from "react-bootstrap/Image"
import metamaskLogo from '../assets/metamask.png'
import errorImg from '../assets/error.png'

const style = {
    wrapper: `flex justify-center h-screen w-screen select-none bg-[#15202b] text-white`,
    content: `max-w-[1400px] w-2/3 flex justify-between`,
    loginContainer: `w-full h-full flex flex-col justify-center items-center pb-48`,
    walletConnectButton: `text-2xl text-black bg-white font-bold mb-[-3rem] mt-[3rem] px-6 py-4 rounded-full cursor-pointer hover:bg-[#d7dbdc]`,
    loginContent: `text-3xl font-bold text-center mt-24`,
  }
  
const Home = () => {
    const { appStatus, connectToWallet } = useContext(TwitterContext)

    const app = (status = appStatus) => {
        switch(status) {
            case 'connected':
                return userLoggedIn
            
            case 'notConnected':
                return noUserFound
            
            case 'noMetaMask':
                return noMetaMaskFound

            case 'error':
                return error

            default:
                return loading
        }
    }

    const userLoggedIn = (
        <div className={style.content}>
            <Sidebar />
            <Feed />
            <Widgets />
        </div>
    )
    
    const noUserFound = (
        <div className={style.loginContainer}>
            <Image src={metamaskLogo} width={200} height={200} />
            <div 
                className={style.walletConnectButton} 
                onClick={() => connectToWallet()}
            >
                Connect Wallet
            </div>
            <div className={style.loginContent}>Connect to Wallet</div>
        </div>
    )
    const noMetaMaskFound = (
        <div className={style.loginContainer}>
            <Image src={metamaskLogo} height={200} width={200} />
            <div>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://metamask.io/download.html`}
                    className={style.loginContent}
                >
                    You must install Metamask, <br /> a virtual Ethereum wallet, in your
                    browser.
                </a>
            </div>
        </div>
    )

    const error = (
        <div className={style.loginContainer}>
            <Image src={errorImg} height={250} width={250} />
            <div className={style.loginContent}>
                An error occurred. Please try again later or use another browser.
            </div>
        </div>
    )

    const loading = (
        <div className={style.loginContainer}>
            <div className={style.loginContent}>Loading...</div>
        </div>
    )
    return (
        <div className={style.wrapper}>
            {app(appStatus)}
        </div>
    )
}

export default Home
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { client } from "../lib/client"

export const TwitterContext = createContext()

export const TwitterProvider = ({ children }) => {

    const [appStatus, setAppStatus] = useState('loading')
    const [currentAccount, setCurrentAccount] = useState('')
    const [tweets, setTweets] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        checkIfWalletIsConnected()
    })

    useEffect(() => {
        if (!currentAccount && appStatus === 'connected') return
        getCurrentUserDetails(currentAccount)
        fetchTweets()
    }, [currentAccount, appStatus])

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setAppStatus('noMetaMask')
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_accounts',
            })
            if (addressArray.length > 0) {
                
                setAppStatus('connected')
                setCurrentAccount(addressArray[0])
                createUserAccount(addressArray[0])
            } else {
                navigate('/')
                setAppStatus('notConnected')
            }
        } catch (error) {
            
            setAppStatus('error')
        }
    }

    const connectToWallet = async () => {
        if (!window.ethereum) return setAppStatus('noMetaMask')
        try {
            setAppStatus('loading')

            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })

            if (addressArray.length > 0) {
                
                setCurrentAccount(addressArray[0])
                createUserAccount(addressArray[0])
            } else {
                navigate('/')
                setAppStatus('notConnected')
            }
        } catch(error){
            setAppStatus('error')
        }
    }

    /**
     * @param {String} userWalletAddress
     */

    const createUserAccount = async (userWalletAddress = currentAccount) => {
        if (!window.ethereum) return setAppStatus('noMetaMask')
        try {
            const userDoc = {
                _type: 'users',
                _id: userWalletAddress,
                name: 'Unnamed',
                isProfileImageNft: false,
                profileImage:
                'https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg',
                walletAddress: userWalletAddress,
            }

            await client.createIfNotExists(userDoc)

            setAppStatus('connected')
        } catch(error){
            navigate('/')
            setAppStatus('error')
        }
    }
    const getProfilImageUrl = async (imageUri, isNft) => {
        if (isNft){
            return `https://gateway.pinata.cloud/ipfs/${imageUri}`
        } else {
            return imageUri
        }
    }

    const fetchTweets = async () => {
        const query = `
            *[_type == "tweets"]{
                "author": author->{name, walletAddress, profileImage, isProfileImageNft},
                tweet,
                timestamp
            }|order(timestamp desc)
        `
        const sanityResponse = await client.fetch(query)
        setTweets([])

        sanityResponse.forEach(async (item) => {
            const profileImageUrl = await getProfilImageUrl(
                item.author.profileImage,
                item.author.isProfileImageNft
            )
        
        if (item.author.isProfileImageNft){
            const newItem = {
                tweet: item.tweet,
                timestamp: item.timestamp,
                author: {
                    name: item.author.name,
                    walletAddress: item.author.walletAddress,
                    isProfileImageNft: item.author.isProfileImageNft,
                    profileImage: profileImageUrl,
                },
            }

            setTweets((prevState) => [...prevState, newItem])
            } else {
                setTweets(prevState => [...prevState, item])
            }  
        })
    }

    const getCurrentUserDetails = async (userAccount = currentAccount) => {
        if (appStatus !== 'connected') return

        const query = `
            *[_type == "users" && _id == "${userAccount}"]{
                "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
                name,
                profileImage,
                isProfileImageNft,
                coverImage,
                walletAddress
            }
        `

        const sanityResponse = await client.fetch(query)

        const profileImageUri = await getProfilImageUrl(
            sanityResponse[0].profileImage,
            sanityResponse[0].isProfileImageNft,
        )
        
        setCurrentUser({
            tweets: sanityResponse[0].tweets,
            name: sanityResponse[0].name,
            profileImage: profileImageUri,
            isProfileImageNft: sanityResponse[0].isProfileImageNft,
            coverImage: sanityResponse[0].coverImage,
            walletAddress: sanityResponse[0].walletAddress,
        })

    }

    return (
        <TwitterContext.Provider 
            value={{ 
                appStatus, 
                currentAccount, 
                connectToWallet, 
                fetchTweets, 
                tweets, 
                currentUser,
                getCurrentUserDetails
            }}
        >
            {children}
        </TwitterContext.Provider>
    )
}
import Post from "../Post"
import { useContext, useEffect, useState } from "react"
import { TwitterContext } from "../../context/TwitterContext"

const style = {
    wrapper: `no-scrollbar`,
    header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
    headerTitle: `text-xl font-bold`,
}

const ProfileTweets = () => {
    const { currentUser } = useContext(TwitterContext)
    const [tweets, setTweets] = useState([
        {
            timestamp: '',
            tweet: '',
        },
    ])

    const [author, setAuthor] = useState({
        name: '',
        profileImage: '',
        walletAddress: '',
        isProfileImageNft: undefined,
      })
    useEffect(() => {
        if (!currentUser) return

        setTweets(currentUser.tweets)
        setAuthor({
            name: currentUser.name,
            profileImage: currentUser.profileImage,
            walletAddress: currentUser.walletAddress,
            isProfileImageNft: currentUser.isProfileImageNft,
        })
    }, [currentUser])

    return(
        <div className={style.wrapper}>
            {tweets?.map((tweet, index) => (
                <Post
                    key={index}
                    displayName={
                        author.name === 'Unnamed'
                        ? `${author.walletAddress.slice(
                            0,
                            4
                        )}...${author.walletAddress.slice(41)}`
                        : author.name
                    }
                    userName={`${author.walletAddress.slice(0,4)}...${author.walletAddress.slice(-4)}`}
                    avatar={author.profileImage}
                    text={tweet.tweet}
                    isProfileImageNft={author.isProfileImageNft}
                    timestamp={tweet.timestamp}
                />
            ))}
        </div>
    )
}

export default ProfileTweets
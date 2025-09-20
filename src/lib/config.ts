const config = {
    env: {
        imagekit: {
            publickey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
            urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
            privatekey : process.env.IMAGEKIT_PRIVATE_KEY
        }
    }
}
          
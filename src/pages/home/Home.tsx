
import React from 'react'
import Banner from '../../components/Banner'
import PopularClasses from '../../components/PopularClasses'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { useSelector } from 'react-redux'
import type { Store } from '../../stores'


export default function Home() {
    const userStore = useSelector((store: Store) => store.user)
    return (
        <>
            <style>
                {`
                    * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }

                    html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    }
  `}
            </style>
            <p>Xin chao: {userStore.data?.displayName}</p>

            <Header />
            <Banner />
            <PopularClasses />
            <Footer />
        </>
    )
}

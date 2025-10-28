import { useSelector } from 'react-redux'
import type { Store } from '../stores'
import Header from '../components/common/Header'
import Banner from '../components/common/Banner'
import PopularClasses from '../components/common/PopularClasses'
import Footer from '../components/common/Footer'


export default function HomePage() {
    const authStore = useSelector((store: Store) => store.auth)
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

            <Header />
            <Banner />
            <PopularClasses />
            <Footer />
        </>
    )
}


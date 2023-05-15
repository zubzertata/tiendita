import Navegation from "@/componentes/Navegation";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navegation />
      <Component {...pageProps} />

    </>
   
  )
}

export default MyApp;

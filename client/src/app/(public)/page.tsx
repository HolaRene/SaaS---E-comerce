import { BentoGrid6 } from "@/components/landing/BentoGrid/bento-grid"
import { FeatureSection9 } from "@/components/landing/caracteristicas/Caracteristicas-seccion"
import { FaqSection2 } from "@/components/landing/faq/Preguntas-Frecuentes"
import { Footer1 } from "@/components/landing/footer-seccion-landing/Footer-Seccion"
import { HeroSection2 } from "@/components/landing/hero-seccion/HeroSeccion"
import { LogoSection10 } from "@/components/landing/logo-seccion/logo-seccions"
import { LpNavbar1 } from "@/components/landing/nav/LpNavbar1"
import { PricingSection3 } from "@/components/landing/seccion-precios/PreciosSeccion"
import TestimonialsSection1 from "@/components/landing/testimonials-seccion/Testimonios-Seccion"

const Page = () => {
    return (
        <main className=''>
            <LpNavbar1 />
            <HeroSection2 />
            <LogoSection10 />
            <TestimonialsSection1
                quote="Desde que uso MiPulpería Digital, llevo el control de mis ventas y fiados sin complicaciones. ¡Ahora sé exactamente cuánto gano cada día y mis clientes reciben sus avisos al instante!"
                authorName="El mero don"
                authorRole="Propietaria de Pulpería La Esperanza"
                avatarSrc="/DavidPark.png"
            />

            <BentoGrid6 />
            <FeatureSection9 />
            <TestimonialsSection1
                quote="Antes llevaba todo en una libreta, ahora con MiPulpería Digital vendo más rápido y no se me olvida quién me debe. ¡Hasta mis clientes están contentos con los mensajes automáticos!"
                authorName="Monica"
                authorRole="Dueña de Pulpería El Buen Vecino"
                avatarSrc="/MonicaKurt.png"
            />

            <PricingSection3 />
            <FaqSection2 />
            <Footer1 />
        </main>
    )
}

export default Page
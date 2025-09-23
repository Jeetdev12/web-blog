import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";


export default function HomePage() {


    return (
        <AnimationWrapper>
            <section className="hcover flex  justify-center gap-10 ">
                <div >
                    <InPageNavigation routes={["Home","Trending Blogs"]}>

                    </InPageNavigation>
                </div>
                <div>

                </div>
            </section>
        </AnimationWrapper>
    )
}
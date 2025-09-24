import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";


export default function HomePage() {


    return (
        <AnimationWrapper>
            <section className="h-cover flex  justify-center gap-10 ">
                {/* Latest blogs */}
                <div className="w-full">
                    <InPageNavigation routes={["Home","Trending Blogs"]} defaultHidden={["Trending Blogs"]}>

           <h1>Latest blogs here</h1>
           <h1>Trending blogs here</h1>

                    </InPageNavigation>
                </div>
                
                <div>

                </div>
            </section>
        </AnimationWrapper>
    )
}
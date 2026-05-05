import Spline from "@splinetool/react-spline";

const SplineScene = () => {
  return (
    <div className="mx-auto h-[360px] w-full max-w-[620px] md:h-[480px] lg:h-[560px]">
      <Spline
        className="h-full w-full"
        scene="https://prod.spline.design/c3yFyayiujGwDF3O/scene.splinecode"
      />
    </div>
  );
};

export default SplineScene;

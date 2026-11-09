import { motion as Motion } from "framer-motion";
import Hr from "../../components/Hr";
import Photo from "../../components/Photo";
import { pickPhoto } from "../../lib/photos";
import { profile, bio } from "../../data/content";

function Title() {
  return (
    <div className="mt-10 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
      <div className="flex justify-center items-center flex-col my-5 self-start">
        <Hr variant="long" />
        <h1 className="text-3xl font-bold mt-3">Who Am I?</h1>
      </div>
    </div>
  );
}

export default function WhoAmI() {
  const fallback = pickPhoto("profile");
  const p1 = pickPhoto("me1") ?? fallback;
  const p2 = pickPhoto("me2") ?? fallback;
  const p3 = pickPhoto("me3") ?? fallback;
  const tile = "absolute aspect-square grayscale hover:grayscale-0 transition-all ease duration-300";

  return (
    <>
      <Title />
      <div className="relative mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10">
        <div className="flex justify-center items-start flex-col mb-5">
          <div className="images relative w-full aspect-square">
            <div className={`${tile} top-28 left-10 w-[50%]`}>
              <Motion.div
                initial={{ opacity: 0, scale: 0.5, x: 100 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                className="relative w-full h-full"
              >
                <Photo src={p1} alt={profile.name} fill className="object-cover" />
              </Motion.div>
            </div>
            <div className={`${tile} top-16 right-28 w-[30%]`}>
              <Motion.div
                initial={{ opacity: 0, scale: 0.5, x: -100 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative w-full h-full"
              >
                <Photo src={p2} alt={profile.name} fill className="object-cover" />
              </Motion.div>
            </div>
            <div className={`${tile} bottom-16 right-20 w-[40%]`}>
              <Motion.div
                initial={{ opacity: 0, scale: 0.5, x: -100 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative w-full h-full"
              >
                <Photo src={p3} alt={profile.name} fill className="object-cover" />
              </Motion.div>
            </div>
          </div>
        </div>
        <Motion.div
          className="flex justify-center items-start flex-col mb-5 md:px-10"
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <h2 className="text-2xl font-bold tracking-wider mb-3">{profile.name}</h2>
          <div className="text-gray-600 text-justify title text-lg leading-relaxed space-y-5">
            {bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Motion.div>
      </div>
    </>
  );
}

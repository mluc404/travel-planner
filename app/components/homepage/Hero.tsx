import Link from "next/link";
import Image from "next/image";
import backupBG from "@/public/backupBG.svg";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 px-4">
      <h1 className="text-4xl font-extrabold text-white text-center mt-8">
        Welcome to <span className="text-blue-500">Roamio</span> - your personal
        travel planner
      </h1>
      <p className="text-xl text-gray-200 text-center">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.{" "}
      </p>
      <Link href="/create-trip">
        <button className="btn-primary">Get Started</button>
      </Link>
      {/* <Image
        src={backupBG}
        alt="backgroud image"
        width="500"
        height="200"
      ></Image> */}
    </div>
  );
}

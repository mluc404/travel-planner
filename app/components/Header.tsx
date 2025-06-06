import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div
      className="p-2 flex justify-between items-center 
    bg-[#15191d] "
    >
      <Link href="/">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Travel app logo" width={50} height={50} />
          <h1 className="text-xl font-bold">Roamio</h1>
        </div>
      </Link>
      <button className="btn-primary">Sign In</button>
    </div>
  );
}

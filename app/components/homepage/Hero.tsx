import Button from "@mui/material/Button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 px-4">
      <h1 className="text-4xl font-extrabold text-white text-center mt-8">
        Welcome to <span className=" text-blue-500">Roamio</span> - Your Travel
        Companion
      </h1>
      <p className="text-xl text-gray-200 text-center">
        Craft the perfect trip with our smart travel planner
      </p>
      <Link href="/create-trip">
        {/* <button className="btn-primary-2">Start Exploring</button> */}
        <Button
          variant="outlined"
          sx={{
            color: "white",
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "600",
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 1)",
            },
            "& .MuiCircularProgress-root": {
              color: "white",
            },
          }}
        >
          Start Exploring
        </Button>
      </Link>
    </div>
  );
}

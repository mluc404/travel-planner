"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/app/context/SessionContext";
import { Auth } from "@/app/auth/Auth";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";

export default function Header() {
  const session = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToCreateTrip = () => {
    setAnchorEl(null);
    router.push("/create-trip");
  };
  const goToProfile = () => {
    setAnchorEl(null);
    router.push("/profile");
  };
  const goToMyTrips = () => {
    setAnchorEl(null);
    router.push("/trips");
    // router.push("/user-page");
  };

  const handleSignOut = async () => {
    handleClose();
    await supabase.auth.signOut({ scope: "local" });
    router.push("/");
  };
  return (
    <div
      className="p-2 pr-4 flex justify-between items-center 
    bg-[#15191d] "
    >
      <Link href="/">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Travel app logo" width={50} height={50} />
          <h1 className="text-xl font-bold">Roamio</h1>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="outlined"
          size="small"
          sx={{
            minWidth: "auto",
            width: "3rem",
            color: "white",
            fontSize: "1rem",
            borderColor: "white",
            backgroundColor: "",
            textTransform: "none",
            padding: "0",
            "&:hover": {
              backgroundColor: "#99a1af",
              color: "black",
              borderColor: "black",
            },
          }}
          onClick={() => router.push("/create-trip")}
        >
          {/* <div className="border-1 border-white flex justify-center items-center rounded px-2"> */}
          {/* <div className="btn-header" onClick={() => router.push("/create-trip")}> */}
          <AddIcon
            sx={{
              fontSize: "1.5rem",
            }}
          />
          {/* </div> */}
        </Button>

        {!session && (
          <div className="mt-auto">
            {/* <div
              className="btn-header"
              onClick={() => setIsSignInOpen(!isSignInOpen)}
            >
              Sign In
            </div> */}
            <Button
              // id="basic-button"
              variant="outlined"
              // variant="text"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={() => setIsSignInOpen(!isSignInOpen)}
              sx={{
                color: "white",
                fontSize: "1rem",
                borderColor: "white",
                backgroundColor: "",
                textTransform: "none",
                // padding: "5px 12px",
                "&:hover": {
                  backgroundColor: "#99a1af",
                  color: "black",
                  borderColor: "black",
                },
              }}
            >
              Sign In
            </Button>
          </div>
        )}

        {isSignInOpen && (
          <Auth
            onClose={() => setIsSignInOpen(false)}
            redirectPath={pathName}
          />
        )}

        {/* New compact menu */}
        {session && (
          <div>
            <Button
              // id="basic-button"
              variant="outlined"
              // variant="text"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                color: "white",
                fontSize: "1rem",
                borderColor: "white",
                backgroundColor: "",
                textTransform: "none",
                // padding: "5px 12px",
                "&:hover": {
                  backgroundColor: "#99a1af",
                  color: "black",
                  borderColor: "black",
                },
              }}
            >
              {/* <div className="btn-header" onClick={handleClick}> */}
              Account
              {/* </div> */}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
                // paper: {
                //   style: {
                //     minWidth: anchorEl ? anchorEl.clientWidth : undefined,
                //   },
                // },
              }}
            >
              <MenuItem onClick={goToProfile}> Profile </MenuItem>
              <MenuItem onClick={goToMyTrips}>My Trips</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
}

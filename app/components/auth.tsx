interface AuthProps {
  isSignInOpen: boolean;
  onClose: () => void;
}

export function Auth({ isSignInOpen, onClose }: AuthProps) {
  return (
    <div
      className="w-[100vw] h-dvh fixed top-0 bg-black/80
       flex justify-center items-center"
      onClick={(e) => onClose()}
    >
      <div
        className="fixed top-[20vh] z-99 w-[300px] h-[300px] bg-white
         flex flex-col justify-between items-center p-4 rounded-xl"
      >
        <div className="text-xl">Sign In</div>
        <button className="btn-primary" onClick={(e) => onClose()}>
          X
        </button>
      </div>
    </div>
  );
}

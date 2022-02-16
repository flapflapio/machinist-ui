import Image from "next/image";
import kitty from "../../../public/kitty.jpeg";

const Login = (): JSX.Element => {
  console.log(kitty);

  return (
    <div>
      <Image src={kitty} alt="kitty" />
      <img src={kitty.src} alt="asd" />
    </div>
  );
};

export { Login };

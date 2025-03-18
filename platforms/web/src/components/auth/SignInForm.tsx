import { FormEvent, useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { toast } from "react-toastify"
import { useNavigate } from "react-router";
import { useAtom } from "jotai/react";
import { profileAtom, tokenAtom } from "../../atoms/auth";
import Spinner from "../atoms/Spinner";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setProfile] = useAtom(profileAtom)
  const [, setToken] = useAtom(tokenAtom)
  const navigate = useNavigate()

  const [isPending, setIsPending] = useState(false)


  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    setIsPending(true)

    event.preventDefault()

    const form = new FormData(event.currentTarget)

    await fetch(`${import.meta.env.VITE_BASE_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type' : "application/json"
      },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    })
      .then(res => {
        if (res.status == 401) {
          toast.error("Username atau Password salah!", { position: "top-right"})
          setIsPending(false)
          return undefined
        }

        return res.json()
      })
      .then(data => {
        if (!data) {
          toast.error("Gagal masuk!, harap hubungi admin!", { position: 'top-right' })
          setIsPending(false)
          return
        }

        const responseData = data.data
        
        setProfile(responseData.admin)
        setToken(responseData.token)
        
        toast.success("Berhasil Masuk", { position: "top-right"})
        setIsPending(false)

        setTimeout(() => navigate("/"), 2000)
      })

  }


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Masuk
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Harap masukkan email dan password
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" name="email" type="email"/>
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className={`w-full bg-brand-600 text-white py-3 flex items-center gap-x-3 ${isPending ? 'opacity-75' : ''}`} type="submit">
                    <Spinner state={isPending} />
                    Masuk
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

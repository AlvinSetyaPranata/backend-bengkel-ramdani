import { useAtom } from 'jotai'
import React, { PropsWithChildren, useEffect } from 'react'
import { tokenAtom } from '../atoms/auth'
import { useNavigate } from 'react-router'

const Security: React.FC<PropsWithChildren> = ({ children }) => {

    const [token,] = useAtom(tokenAtom)
    const navigate = useNavigate()

    useEffect(() => {
      console.log(token)

        // if (!token) {
        //     navigate("/signin")
        // }
    }, [])

  return (
    <>{children}</>
  )
}

export default Security
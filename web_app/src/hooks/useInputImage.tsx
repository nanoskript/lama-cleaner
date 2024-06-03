import { API_ENDPOINT } from "@/lib/api"
import { useCallback, useEffect, useState } from "react"

export default function useInputImage() {
  const [inputImage, setInputImage] = useState<File | null>(null)

  // Load image from a URL on open.
  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const imageUrl = urlParams.get('image')
      if (imageUrl) {
        const response = await fetch(imageUrl)
        setInputImage(new File([await response.blob()], 'image'))
      }
    })()
  }, []);

  const fetchInputImage = useCallback(() => {
    const headers = new Headers()
    headers.append("pragma", "no-cache")
    headers.append("cache-control", "no-cache")

    fetch(`${API_ENDPOINT}/inputimage`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          return
        }
        const filename = res.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          .split(";")[0]

        const data = await res.blob()
        if (data && data.type.startsWith("image")) {
          const userInput = new File(
            [data],
            filename !== undefined ? filename : "inputImage"
          )
          setInputImage(userInput)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [setInputImage])

  useEffect(() => {
    fetchInputImage()
  }, [fetchInputImage])

  return inputImage
}

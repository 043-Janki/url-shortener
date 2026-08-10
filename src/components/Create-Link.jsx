import { UrlState } from "@/context";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/Button";
import Error from "./Error";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import * as yup from "yup";
import QRCode from "react-qrcode-logo";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/ApiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    // if (error === null && data) {
    //   navigate(`/link/${data[0].id}`);
    // }
    if (!error && data?.length > 0) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data, navigate]);

  // const {
  //   loading,
  //   error,
  //   data,
  //   fn: fnCreateUrl,
  // } = useFetch(createUrl, { ...formValues, user_id: user.id });

  // const createNewUrl = async () => {
  //   setErrors({});
  //   try {
  //     await schema.validate(formValues, { abortEarly: false });
  //     // const canvas = ref.current.canvasRef.current;
  //     const canvas = ref.current?.canvasRef?.current;

  //     if (!canvas) {
  //       return;
  //     }

  //     const blob = await new Promise((resolve) => canvas.toBlob(resolve));

  //     await fnCreateUrl(blob);
  //   } catch (e) {
  //     const newErrors = {};

  //     e?.inner?.forEach((err) => {
  //       newErrors[err.path] = err.message;
  //     });
  //     setErrors(newErrors);
  //   }
  // };

  const createNewLink = async () => {
    setErrors({});

    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current?.canvasRef?.current;

      if (!canvas) return;

      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      {/* <Dialog
      open={!!longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    > */}
      <DialogTrigger>
        <Button
          variant="destructive"
          onClick={() => setSearchParams({ createNew: true })}
        >
          Create New Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && (
          <QRCode value={formValues?.longUrl} size={250} ref={ref} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="px-4 py-2 flex items-center justify-center">
            trimrr.in
          </Card>{" "}
          /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}

        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading}
            onClick={createNewLink}
            variant="destructive"
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;

import './App.css'
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {Button, TextField} from "@mui/material";


type FormValues = {
  name: string
  email: string
  message: string
}
export const App = () => {
  const {control, handleSubmit, formState: {errors}} = useForm<FormValues>(
    {
      defaultValues: {
        name: '',
        email: '',
        message: ''
      }
    }
  );

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data)
      console.log("response", response.data)
    } catch (error) {
      console.error("error", error)

    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({field}) =>
            <TextField {...field} label="Name"/>}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{required: 'Email is required'}}
          render={({field}) => <TextField {...field} label="Email"/>}
        />
        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{required: 'Message is required'}}
          render={({field}) => <TextField {...field} label="Message"/>}
        />
        <Button type="submit">Submit</Button></form>
    </>
  )
}


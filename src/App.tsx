import './App.css'
import {Controller, SubmitHandler, useFieldArray, useForm} from "react-hook-form";
import axios from "axios";
import {Button, IconButton, TextField} from "@mui/material";
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material';


type FormValues = {
  name: string
  email: string
  message: string
}

type FormArray = {
  formData: FormValues[];
};
export const App = () => {
  const {control, handleSubmit} = useForm<FormArray>(
    {
      defaultValues: {
        formData: [{name: '', email: '', message: ''}],
      }
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "formData"
  });
  const onSubmit: SubmitHandler<FormArray> = async (data) => {
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
        {fields.map((field, index) => (
          <div key={field.id}>
            <Controller
              name={`formData.${index}.name`} // 配列内の各要素にアクセス
              control={control}
              render={({field}) => <TextField {...field} label="Name"/>}
            />
            <Controller
              name={`formData.${index}.email`}
              control={control}
              render={({field}) => <TextField {...field} label="Email"/>}
            />
            <Controller
              name={`formData.${index}.message`}
              control={control}
              render={({field}) => <TextField {...field} label="Message"/>}
            />
            <IconButton onClick={() => remove(index)}>
              <DeleteIcon/>
            </IconButton>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => append({name: '', email: '', message: ''})}
          startIcon={<AddIcon/>}
        >
          Add Form
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </>
  )
}


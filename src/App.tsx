import './App.css'
import {Controller, Path, SubmitHandler, useFieldArray, useForm, Control} from "react-hook-form";
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
  const {control, handleSubmit, reset} = useForm<FormArray>(
    // useFormはReact Hook Formの、フォームの状態を管理するためのカスタムフック
    // control: フォームの状態を管理するためのオブジェクト.Controllerに渡すことで、フォームデータやバリデーションを管理できる
    // reset: フォームの値をリセットする関数
    {
      defaultValues: {
        formData: [{name: '', email: '', message: ''}],
      }
    }
  );
  const {fields, append, remove} = useFieldArray<FormArray, 'formData'>({
    control: control,
    name: 'formData',
  });
  const onSubmit: SubmitHandler<FormArray> = async (data) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', data)

      reset()

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
              name={`formData.${index}.name`}
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


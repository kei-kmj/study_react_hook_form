import './App.css'
import {Controller, Path, SubmitHandler, useFieldArray, useForm, Control} from "react-hook-form";
import axios from "axios";
import {Button, IconButton, TextField} from "@mui/material";
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {useState} from "react";


type FormValues = {
  name: string
  email: string
  message: string
  isActive: boolean
}

type FormArray = {
  formData: FormValues[];
};
export const App = () => {
  const {control, handleSubmit, reset} = useForm<FormArray>(
    // useFormはReact Hook Formの、フォームの状態を管理するためのカスタムフック
    // control: フォームの状態を管理するためのオブジェクト.Controllerに渡すことで、フォームデータやバリデーションを管理できる
    // reset: フォームの値をリセットする関数
    // shouldUnregister: アンマウントになっているフォームの値を非登録にするかどうか
    {
      defaultValues: {
        formData: [{name: '', email: '', message: '', isActive: true}],
      },
      mode: "onBlur",
      shouldUnregister: true
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
  const [showAll, setShowAll] = useState(true)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          type="button"
          onClick={() => setShowAll(prev => !prev)}
          startIcon={<AddIcon/>}
        >
          {showAll ? '有効な行のみ表示' : 'すべての行を表示'}
        </Button>
        {fields.map((field, index) => (
          (field.isActive || showAll) && (
            <div key={field.id}>
              <Controller
                name={`formData.${index}.name`}
                rules={{required: 'Name is required', minLength: {value: 1, message: 'Name is too short'}}}
                control={control}
                render={({field, fieldState: {error}}) =>
                  <TextField
                    {...field}
                    label="Name"
                    error={!!error}
                    helperText={error ? error.message : null}/>}
              />
              <Controller
                name={`formData.${index}.email`}
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address'
                  }
                }}
                render={({field, fieldState: {error}}) =>
                  <TextField
                    {...field}
                    label="Email"
                    error={!!error}
                    helperText={error ? error.message : null}/>}
              />
              <Controller
                name={`formData.${index}.message`}
                control={control}
                render={({field}) => <TextField {...field} label="Message"/>}
              />
              <Controller
                name={`formData.${index}.isActive`}
                control={control}
                render={({field}) => (
                  <IconButton onClick={() => field.onChange(!field.value)}>
                    {field.value ? 'Active' : 'Inactive'}
                  </IconButton>
                )}/>

              <IconButton onClick={() => remove(index)}>
                <DeleteIcon/>
              </IconButton>
            </div>)
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


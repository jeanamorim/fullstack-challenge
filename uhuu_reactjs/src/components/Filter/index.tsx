import React, { SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form'
import { formatCEP } from '../../utils/format';
import { toast } from 'react-toastify'
import { deleteAll, getGeoCode, submitClient } from './filterservice';
import CircularProgress from '@material-ui/core/CircularProgress'

interface Params {
  setOnRefleshScreen:React.Dispatch<SetStateAction<boolean>>;
}

const Filter: React.FC<Params> = ({setOnRefleshScreen}) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState({
    cep: false,
    register: false,
    reset: false,
  })
  const [postacode, setPostalCode] = useState("")
  const [openAdress, setOpenAdress] = useState(false);
  const [error, setError] = useState(false)
  const [fields, setFields] = useState({
    name: '',
    peso: "",
    latitude: "",
    longitude: "",
    "logradouro": "",
    "bairro": "",
    "numero": "",
    "complemento": "",
    "cidade": "",
    "estado": "",
    "pais": ""
  })

  const getSubmitPostalCode = () => {
    if (postacode.length < 9) return
    setLoading({
      ...loading,
      cep: true
    })
    getGeoCode(postacode)
      .then((res) => {
        setFields({
          ...fields,
          latitude: res.data.geolocalizacao.lat,
          longitude: res.data.geolocalizacao.lon,
          logradouro: res.data.address.logradouro,
          numero: "",
          bairro: res.data.address.bairro,
          complemento: res.data.address.complemento,
          cidade: res.data.address.localidade,
          estado: res.data.address.uf,
          pais: ""
        })
        setOpenAdress(true)
        setError(false);
      })
      .catch((err) => {
        setOpenAdress(false);
        emptyState();
        setError(true);
        toast.error("CEP não encontrado. Tente novamente!")
      })
      .finally(() => {
        setLoading({
          ...loading,
          cep: false
        })
      })
  }

  const emptyState = () => {
    setFields({
      ...fields,
      "logradouro": "",
      "numero": "",
      "bairro": "",
      "complemento": "",
      "cidade": "",
      "estado": "",
      "pais": ""
    })
  }

  const emptyStateFileds = () => {
    setFields({
      name: '',
      peso: "",
      latitude: "",
      longitude: "",
      "logradouro": "",
      "bairro": "",
      "numero": "",
      "complemento": "",
      "cidade": "",
      "estado": "",
      "pais": ""
    })
    setPostalCode("")
    setOpenAdress(false)
  }

  const onchangeValue = (value: any) => {
    setFields({
      ...fields,
      latitude: "",
      longitude: "",
      "logradouro": "",
      "numero": "",
      "bairro": "",
      "complemento": "",
      "cidade": "",
      "estado": "",
      "pais": ""
    })

    setOpenAdress(false);
    const cepFormated = formatCEP(value.target.value)
    setPostalCode(cepFormated)
  }

  const onSubmit = () => {
    if (!fields.longitude || !fields.latitude) return
    setLoading({
      ...loading,
      register: true
    })
    submitClient(fields)
      .then(() => {
        toast.success("Registros cadastrado com sucesso!")
        setOnRefleshScreen((prev: boolean) => !prev)
        emptyStateFileds();
      })
      .catch((err) => {
        toast.error("Um erro aconteceu. Tente novamente mais tarde.")
      })
      .finally(() => {
        setLoading({
          ...loading,
          register: false
        })
      })
  }

  const onChangeInput = (text: any) => {
    const { value, name } = text.target
    setFields({
      ...fields,
      [name]: value
    })
  }

  const onDeleteAll = () => {
    if (window.confirm('Você realmente deseja deletar todos registros ?')) {
      setLoading({
        ...loading,
        reset: true
      })
      deleteAll()
        .then(() => {
          setOnRefleshScreen((prev: boolean) => !prev)
          toast.success("Registros deletados com sucesso!")
        })
        .catch((err) => {
          toast.error("Um erro aconteceu. Tente novamente mais tarde.")
        })
        .finally(() => {
          setLoading({
            ...loading,
            reset: false
          })
        })
    }
  }


  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-gray-200 rounded-lg p-5 m-2">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mt-0">
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                className="
              appearance-none
                 relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500
                   text-gray-900 focus:outline-none
                    focus:ring-indigo-500 focus:border-indigo-500
                     focus:z-10 sm:text-sm m-1 rounded"
                placeholder="Nome do cliente"
                value={fields.name}
                onChange={(text) => onChangeInput(text)}
              />
            </div>
            <div className="mt-1">
              <input
                name="peso"
                type="number"
                required
                className="appearance-none 
              relative block w-full 
                px-3 py-2 border border-gray-300
                 placeholder-gray-500 text-gray-900 
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm m-1 rounded mt-3"
                placeholder="Peso da Entrega"
                value={fields.peso}
                onChange={(text) => onChangeInput(text)}
              />
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="mt-1">
                <input
                  name="adresses"
                  type="adresses"
                  value={postacode}
                  maxLength={9}
                  required
                  disabled={!fields.name || !fields.peso}
                  onChange={(text) => onchangeValue(text)}
                  className="appearance-none 
               relative block w-full
                 px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 
                   focus:outline-none
                   focus:ring-indigo-500
                    focus:border-indigo-500 
                    focus:z-10 sm:text-sm m-1 rounded mt-5"
                  placeholder="CEP do cliente"
                />
              </div>
              <div>
                <button
                  disabled={!fields.name || !fields.peso || loading.cep || loading.register || loading.reset}
                  onClick={getSubmitPostalCode}
                  className="group relative 
            flex justify-center
            py-2 px-2 border border-#99999988
            text-sm font-medium rounded-md text-gray-500
             bg-white-600 hover:bg-#999999
              focus:outline-none focus:ring-2 focus:ring-offset-2
               focus:ring-#999999 mt-5">
                  {loading.cep ? (
                    <CircularProgress
                      style={{
                        height: '20px',
                        width: '20px',
                      }} />
                  ) : ("Buscar")}
                </button>
              </div>
            </div>
            {openAdress && (
              <>
                <div className="flex flex-row">
                  <input
                    name="logradouro"
                    type="text"
                    required
                    className="appearance-none
              disabled:opacity-80
                 relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500
                   text-gray-900 focus:outline-none
                    focus:ring-indigo-500 focus:border-indigo-500
                     focus:z-10 sm:text-sm mt-8 m-1 rounded"
                    placeholder="Logradouro"
                    value={fields.logradouro}
                    onChange={(text) => onChangeInput(text)}
                  />
                  <input
                    name="bairro"
                    type="text"
                    required
                    className="appearance-none
                 relative block w-full
                  px-3 py-2 border border-gray-300
                   placeholder-gray-500 text-gray-900 
                   focus:outline-none
                    focus:ring-indigo-500
                    disabled:opacity-80
                     focus:border-indigo-500 
                     focus:z-10 sm:text-sm mt-8 m-1 rounded"
                    placeholder="Bairro"
                    value={fields.bairro}
                    onChange={(text) => onChangeInput(text)}
                  />
                </div>


                <div className="flex flex-row">
                  <input
                    name="cidade"
                    type="text"
                    required
                    className="appearance-none
              disabled:opacity-80
                 relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500
                   text-gray-900 focus:outline-none
                    focus:ring-indigo-500 focus:border-indigo-500
                     focus:z-10 sm:text-sm mt-1 m-1 rounded"
                    placeholder="Cidade"
                    value={fields.cidade}
                    onChange={(text) => onChangeInput(text)}
                  />
                  <input
                    name="estado"
                    type="text"
                    required
                    className="appearance-none
                 relative block w-full
                  px-3 py-2 border border-gray-300
                   placeholder-gray-500 text-gray-900 
                   focus:outline-none
                    focus:ring-indigo-500
                    disabled:opacity-80
                     focus:border-indigo-500 
                     focus:z-10 sm:text-sm mt-1 m-1 rounded"
                    placeholder="Estado"
                    value={fields.estado}
                    onChange={(text) => onChangeInput(text)}
                  />
                </div>


                <div className="flex flex-row">
                  <input
                    name="numero"
                    type="text"
                    required
                    className="appearance-none
              disabled:opacity-80
                 relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500
                   text-gray-900 focus:outline-none
                    focus:ring-indigo-500 focus:border-indigo-500
                     focus:z-10 sm:text-sm mt-1 m-1 rounded"
                    placeholder="Numero"
                    value={fields.numero}
                    onChange={(text) => onChangeInput(text)}
                  />
                  <input
                    name="complemento"
                    type="text"
                    required
                    className="appearance-none
                 relative block w-full
                  px-3 py-2 border border-gray-300
                   placeholder-gray-500 text-gray-900 
                   focus:outline-none
                    focus:ring-indigo-500
                    disabled:opacity-80
                     focus:border-indigo-500 
                     focus:z-10 sm:text-sm mt-1 m-1 rounded"
                    placeholder="Complemento"
                    value={fields.complemento}
                    onChange={(text) => onChangeInput(text)}
                  />
                </div>
                <div className="mt-1">
                  <input
                    name="pais"
                    type="text"
                    required
                    className="appearance-none 
              relative block w-full 
                px-3 py-2 border border-gray-300
                 placeholder-gray-500 text-gray-900 
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm m-1 rounded mt-1"
                    placeholder="País"
                    value={fields.pais}
                    onChange={(text) => onChangeInput(text)}
                  />
                </div>
              </>
            )}
            <div className="flex flex-row">
              <input
                name="lat"
                type="text"
                disabled
                className="appearance-none
              disabled:opacity-80
                 relative block w-full px-3 py-2 border
                  border-gray-300 placeholder-gray-500
                   text-gray-900 focus:outline-none
                    focus:ring-indigo-500 focus:border-indigo-500
                     focus:z-10 sm:text-sm mt-8 m-1 rounded"
                placeholder="Latitude"
                value={fields.latitude}
              />
              <input
                name="log"
                type="text"
                disabled
                className="appearance-none
                 relative block w-full
                  px-3 py-2 border border-gray-300
                   placeholder-gray-500 text-gray-900 
                   focus:outline-none
                    focus:ring-indigo-500
                    disabled:opacity-80
                     focus:border-indigo-500 
                     focus:z-10 sm:text-sm mt-8 m-1 rounded"
                placeholder="Logintude"
                value={fields.longitude}
              />
            </div>

            <div className="mt-5 flex">
              <button
                type="submit"
                disabled={loading.cep || loading.register || loading.reset || error}
                className="group relative 
            w-full flex justify-center
            py-2 px-4 border border-transparent
            text-sm font-medium rounded-md text-white
             bg-green-600 hover:bg-green-700
              focus:outline-none focus:ring-2 focus:ring-offset-2
               focus:ring-green-500 mt-5">
                {loading.register ? (
                  <CircularProgress
                    style={{
                      height: '20px',
                      width: '20px',
                    }} />
                ) : ("CADASTRAR CLIENTE")}

              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="border border-gray-200 rounded-lg h-30 p-4 flex mt-2 m-2">
        <button
          onClick={onDeleteAll}
          disabled={loading.cep || loading.register || loading.reset}
          className="group relative 
      w-full flex justify-center py-2
       px-4 border border-transparent text-sm
        font-medium rounded-md text-white
         bg-red-600 hover:bg-red-700
         focus:outline-none focus:ring-2
         focus:ring-offset-2
          focus:ring-red-500">
          {loading.reset ? (
            <CircularProgress
              style={{
                height: '20px',
                width: '20px',
              }} />
          ) : ("RESETAR CADASTRO")}
        </button>
      </div>
    </div>
  )
}

export default Filter;
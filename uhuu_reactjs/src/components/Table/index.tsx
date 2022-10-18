import React, { useState } from 'react';
import { TablePagination } from '@material-ui/core'
import MUIDataTable from 'mui-datatables'
import { getClientesAlls } from './tableService';
import { toast } from 'react-toastify';
import Loading from "../Loading"

type Params = {
  currentPage: number | string;
  pageCount: number | string;
}
type Adress = {
  name: string;
  peso: string;
  endereco: {
    logradouro: string;
    numero: string | number;
    bairro: string;
    complemento: string;
    cidade: string;
    estado: string;
    pais: string;
  },
  geolocalizacao: {
    latitude: string;
    longitude: string;
  }
}

interface ParamsState {
  onRefleshScreen: boolean;
  setMarker: any,
  setDescriptionsItens: any

}

interface PropsArray {
  lat: number;
  lng: number;
}


const Table: React.FC<ParamsState> = ({ onRefleshScreen, setMarker, setDescriptionsItens }: ParamsState) => {
  const [records, setRecords] = useState<Adress[] | []>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [paginationInfo, setPaginationInfo] = useState<Params>(null)
  const [pageSize, setPageSize] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [page, setPage] = useState<number>(0)

  const handleChange = () => {
    setLoading(true)
    let page = 0
    setPage(page)
    getClientesAlls(page, rowsPerPage)
      .then((res) => {
        const markers = res.data.client.map((geo: any) => {
          const lat = Number(`${geo.geolocalizacao[0].latitude}`)
          const lng = Number(`${geo.geolocalizacao[0].longitude}`)
          const name = geo.name;
          const peso = geo.peso;
          const positions = { lat, lng }
          return { name, peso, positions };
        })

        setMarker(markers)
        setRecords(res.data.client)
        setPageSize(res.data.total)
        setPaginationInfo({
          currentPage: res.data.currentPage,
          pageCount: res.data.lastPage,
        })

        setDescriptionsItens({
          total: res.data.total,
          pesoTotal: res.data.totalWeight,
          ticketMedio: res.data.ticketMedio,
        })
      })
      .catch((err) => {
        toast.error("Um erro aconteceu. Tente novamente mais tarde.")
      })
      .finally(() => setLoading(false))
  }

  React.useEffect(() => {
    handleChange()
  }, [onRefleshScreen])



  const handleChangePage = (event, newPage: any) => {
    setLoading(true)
    setPage(newPage)
    getClientesAlls(newPage, rowsPerPage)
      .then((res) => {
        const markers = res.data.client.map((geo: any) => {
          const lat = Number(`${geo.geolocalizacao[0].latitude}`)
          const lng = Number(`${geo.geolocalizacao[0].longitude}`)
          const name = geo.name;
          const peso = geo.peso;
          const positions = { lat, lng }
          return { name, peso, positions };
        })
        setMarker(markers)
        setRecords(res.data.client)
        setPageSize(res.data.total)
        setPaginationInfo({
          currentPage: res.data.currentPage,
          pageCount: res.data.lastPage,
        })
      })
      .catch((err) => {
        toast.error('Um erro aconteceu. tente novamente mais tarde.')
      })
      .finally(() => setLoading(false))
  }
  function handleChangeRowsPerPage(newLimits: any) {
    const itemsPerPage = +newLimits.target.value

    setLoading(true)
    setRowsPerPage(itemsPerPage)
    getClientesAlls(page, itemsPerPage)
      .then((res) => {
        const markers = res.data.client.map((geo: any) => {
          const lat = Number(`${geo.geolocalizacao[0].latitude}`)
          const lng = Number(`${geo.geolocalizacao[0].longitude}`)
          const name = geo.name;
          const peso = geo.peso;
          const positions = { lat, lng }
          return { name, peso, positions };
        })
        setMarker(markers)
        setRecords(res.data.client)
        setPageSize(res.data.total)
        setPaginationInfo({
          currentPage: res.data.currentPage,
          pageCount: res.data.lastPage,
        })
      })
      .catch((err) => {
        toast.error('Um erro aconteceu. tente novamente mais tarde.')
      })
      .finally(() => setLoading(false))
  }

  const columns = [
    {
      name: '',
      label: '',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return (dataIndex + 1)
        },
      },
    },
    {
      name: 'Nome',
      label: 'Nome',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              {records[dataIndex].name.substring(0, 12).length === 12
                ? `${records[dataIndex].name?.substring(0, 12)}...`
                : records[dataIndex].name}
            </>
          )
        },
      },
    },
    {
      name: 'rua',
      label: 'Rua',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              {records[dataIndex].endereco[0].logradouro.substring(0, 12).length === 12
                ? `${records[dataIndex].endereco[0].logradouro?.substring(0, 12)}...`
                : records[dataIndex].endereco[0].logradouro}
            </>
          )
        },
      },
    },
    {
      name: 'cidade',
      label: 'Cidade',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return <>{records[dataIndex].endereco ? records[dataIndex].endereco[0].cidade : ''}</>
        },
      },
    },
    {
      name: 'pais',
      label: 'País',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return <>{records[dataIndex].endereco ? records[dataIndex].endereco[0].pais : ''}</>
        },
      },
    },
    {
      name: 'peso',
      label: 'Peso',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return <>{records[dataIndex].peso ? `${records[dataIndex].peso} Kg` : ''}</>
        },
      },
    },
    {
      name: 'lat',
      label: 'Lat',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return <>{records[dataIndex].geolocalizacao ? records[dataIndex].geolocalizacao[0].latitude : ''}</>
        },
      },
    },
    {
      name: 'lng',
      label: 'Lng',
      options: {
        filter: true,
        setCellHeaderProps: () => ({ style: { backgroundColor: "#99999933" } }),
        customBodyRenderLite: (dataIndex) => {
          return <>{records[dataIndex].geolocalizacao ? records[dataIndex].geolocalizacao[0].longitude : ''}</>
        },
      },
    },
  ]

  return (

    <div className="border border-gray-200 rounded-lg p-1 m-2 w-full">
      {loading && <Loading />}
      {!loading && (
        <div className="overflow-auto">
          <div className="min-w-750">
            <MUIDataTable
              data={records}
              columns={columns}
              options={{
                filterType: 'textField',
                selectableRows: false,
                expandableRowsHeader: false,
                expandableRows: false,
                expandableRowsOnClick: false,
                pagination: false,
                print: false,
                filter: false,
                download: false,
                search: false,
                responsive: 'standard',
                elevation: 1,
                sort: false,
                viewColumns: false,
                textLabels: {
                  body: {
                    toolTip: 'Organizar',
                    noMatch: 'Desculpe, nenhum registro correspondente encontrado',
                  },
                  viewColumns: {
                    title: 'Mostrar colunas',
                  },
                  toolbar: {
                    search: 'Pesquisar',
                    filterTable: 'Filtrar tabela',
                    viewColumns: 'Colunas',
                  },
                },
              }}
            />
          </div>
          {/*@ts-ignore */}
          <TablePagination
            className="min-w-750 bg-white"
            rowsPerPageOptions={[1, 2, 5, 10, 25, 50]}
            component="div"
            count={pageSize}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={"Items por página"}
            labelDisplayedRows={() =>
              `Página ${Number(paginationInfo?.currentPage || page)} de ${paginationInfo?.pageCount || 0
              }`
            }
          />
        </div>
      )}
   </div>
  )
}

export default Table;
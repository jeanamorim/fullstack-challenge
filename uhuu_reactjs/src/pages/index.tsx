import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Filter from '../components/Filter'
import Maps from '../components/Maps'
import Table from '../components/Table'

interface PropsArray {
  positions: {
    lat: number;
    lng: number;
  }
  name: string;
  peso: string;
}
interface PropsDescription {
  total: number,
  pesoTotal: number,
  ticketMedio: number
}


export default function Home() {
  const [onRefleshScreen, setOnRefleshScreen] = useState(false)
  const [marker, setMarker] = useState<PropsArray[]>([])
  const [descriptionsItens, setDescriptionsItens] = useState<PropsDescription>({
    total: 0,
    pesoTotal: 0,
    ticketMedio: 0
  })

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Uhuu</h1>
        </div>
      </header>
      <main>
        <div className="my-12 mx-auto px-4 md:px-12">
          <div className="flex flex-wrap -mx-1 lg:-mx-12 justify-center">
            <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:w-1/4">
              <Filter
                setOnRefleshScreen={setOnRefleshScreen}
              />
            </div>
            <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-1">
              <Maps
                onRefleshScreen={onRefleshScreen}
                marker={marker}
              />
              <span className="text-xs text-gray-900 mx-3">Total de clientes: {descriptionsItens.total}; Peso total: {descriptionsItens.pesoTotal} Kg; Ticket Médio*: {descriptionsItens.ticketMedio}</span>
              <Table
                onRefleshScreen={onRefleshScreen}
                setMarker={setMarker}
                setDescriptionsItens={setDescriptionsItens}
              />
              <span className="text-xs text-gray-900">*Peso Total/Total de Clientes</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
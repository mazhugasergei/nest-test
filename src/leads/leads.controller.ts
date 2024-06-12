import { Controller, Get, Query } from "@nestjs/common"

@Controller("leads")
export class LeadsController {
  @Get()
  async find(
    @Query() params?: { query?: string },
  ): Promise<{ [key: string]: any }[]> {
    const leads = await (async () => {
      const response = await fetch(
        `${process.env.API}/api/v4/leads?with=contacts&query=${params?.query ?? ""}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
        },
      )
      if (response.status !== 200) return []
      return await response.json()
    })()

    if (leads.length === 0) return []

    const pipelines = await (async () => {
      const response = await fetch(
        `${process.env.API}/api/v4/leads/pipelines`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
        },
      )
      return await response.json()
    })()

    const contacts = await (async () => {
      const response = await fetch(
        `${process.env.API}/api/v4/contacts?with=leads`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
        },
      )
      return await response.json()
    })()

    const data = leads._embedded.leads.map((lead: { [key: string]: any }) => {
      /* pipeline */
      const pipeline = pipelines._embedded.pipelines.filter(
        (p: { [key: string]: any }) => p.id === lead.pipeline_id,
      )[0]
      const finalPipeline: { [key: string]: any } = {}
      for (const key of Object.keys(pipeline)) {
        if (!key.startsWith("_")) {
          finalPipeline[key] = pipeline[key]
        }
      }
      finalPipeline.statuses = []
      for (const status of pipeline._embedded.statuses) {
        finalPipeline.statuses.push(status)
      }
      lead.pipeline = { ...finalPipeline }

      /* contacts */
      const contactsIds = lead._embedded.contacts.map(
        (c: { [key: string]: any }) => c.id,
      )
      const filteredContacts = contacts._embedded.contacts.filter(
        (c: { [key: string]: any }) => contactsIds.includes(c.id),
      )
      const finalContacts: { [key: string]: any }[] = []
      for (const c of filteredContacts) {
        const finalC: { [key: string]: any } = {}
        for (const key of Object.keys(c)) {
          if (!key.startsWith("_")) {
            finalC[key] = c[key]
          }
        }
        finalContacts.push(finalC)
      }
      lead.contacts = [...filteredContacts]

      const finalLead: { [key: string]: any } = {}
      for (const key of Object.keys(lead)) {
        if (!key.startsWith("_")) {
          finalLead[key] = lead[key]
        }
      }
      return finalLead
    })

    return data
  }
}

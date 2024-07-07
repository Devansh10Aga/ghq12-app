/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1lFGb2zL9kp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResponsiveLine } from "@nivo/line"

export default function Chart({data}) {
  const chartdata = data.map((res, index)=>{return{
    x: index,
    y: res.score,
    date : new Date(res.date).toLocaleDateString(),
    interpretation : res.interpretation
  }}).reverse()
  console.log(chartdata)
  return (
    <Card className="h-full w-full max-w-2xl">
      <CardHeader>
        <CardTitle>GHQ-12 Chart</CardTitle>
        <CardDescription>A line chart shows previous scores according to their date.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[9/4]">
          
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: chartdata
          }
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#Ff0000"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
        />
</div>
      </CardContent>
    </Card>
  )
}
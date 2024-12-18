

const Schooldetails = () => {
  return (
    <div>
  <p className="text-4xl font-bold">PM SHRI Schools All Over India</p>
  
  <table className="min-w-full bg-white dark:bg-black-800 border border-gray-300 dark:border-neutral-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-white">
            <th className="py-3 px-6 text-left">School Name</th>
            <th className="py-3 px-6 text-left">UDISE Code</th>
            <th className="py-3 px-6 text-left">Contact  and Email</th>
            <th className="py-3 px-6 text-left">Accessibility</th>
            <th className="py-3 px-6 text-left">Primary Languages</th>
            <th className="py-3 px-6 text-left">Visitors</th>
            <th className="py-3 px-6 text-left">School links</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((entry, index) => (
            <tr
              key={index}
              className="border-t border-neutral-200 dark:border-neutral-700"
            >
              <td className="px-6 py-3 text-white-900 ">{entry.schoolName}</td>
              <td className="px-6 py-3 text-white-900 dark:text-white-200">{entry.udiseCode}</td>
              <td className="px-6 py-3 text-white-900 dark:text-white-200">{entry.contact}</td>
              <td className="px-6 py-3 text-white-900 dark:text-white-200">{entry.accessibility}</td>
              <td className="px-6 py-3 text-white-900 dark:text-white-200">{entry.languages.join(', ')}</td>
              <td className="px-6 py-3 text-white-900 dark:text-white-200">{entry.visitorCount}</td>
              <td className="px-6 py-3">
              <button
  className="px-3 py-1 rounded 
    bg-green-100 text-green-700"
  onClick={() => {
   console.log('Button clicked for entry:', entry.id);
  }} 
>
School website
</button>

              </td>
            </tr>
          ))}        </tbody>
      </table>
      
</div>

  )
}
const schools = [
  { id: 1,
    schoolName: "ABC Senior Secondary School",
    udiseCode: "12345678",
    contact: "+91 9876543210, email@example.com",
    accessibility: "Wheelchair accessible",
    languages: ["English", "Hindi"],
    visitorCount: 1500
  },
  {
    id:2,
    schoolName: "XYZ Public School",
    udiseCode: "87654321",
    contact: "+91 9876543211, xyzschool@example.com",
    accessibility: "Not accessible",
    languages: ["English", "Tamil"],
    visitorCount: 3000
  },
  {
    id:3,
    schoolName: "St. Joseph's High School",
    udiseCode: "12348765",
    contact: "+91 9876543212, josephschool@example.com",
    accessibility: "Partially accessible",
    languages: ["English", "Malayalam"],
    visitorCount: 2200
  },
  {id:4,
    schoolName: "Green Valley School",
    udiseCode: "87651234",
    contact: "+91 9876543213, greenvalley@example.com",
    accessibility: "Fully accessible",
    languages: ["English", "Kannada"],
    visitorCount: 1800
  }
];


export default Schooldetails




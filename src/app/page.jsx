import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Attendance System</h1>
      <p>Please use the navigation menu to access different sections of the system.</p>
    </div>
  );
}

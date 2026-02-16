import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DropzoneComponent from "./DropZone";
import Button from "../../ui/button/Button";
import { PaperPlaneIcon } from "../../../icons";

export default function DefaultInputs() {
  const options = [
    { value: "form137", label: "Form 137" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Basic Info">
      <div className="space-y-6">
        <div>
          <Label>Student Number</Label>
          <Select
            options={options}
            placeholder="Input data"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>

        <div>
          <Label>Document Type</Label>
          <Select
            options={options}
            placeholder="Select document type"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>

        <div>
          <Label>Academic Year</Label>
          <Select
            options={options}
            placeholder="Select academic year"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>

        <div>
          <Label>Upload Attachment</Label>
          <DropzoneComponent />
        </div>

        <div className="w-full flex justify-end">
          <Button>Submit<PaperPlaneIcon /></Button>
        </div>
      </div>
    </ComponentCard>
  );
}

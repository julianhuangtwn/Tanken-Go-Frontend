"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


const FormSchema = z.object({
    isPublic: z.enum(["Y", "N"]),
})


export function SaveTripBtn({ handleSaveTripBtn }) {
    const form = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        isPublic: "Y", 
      },
    })

    function onSubmit(data) {
        // Call the function from parent to save the trip
        handleSaveTripBtn(data.isPublic)
    }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Save Trip</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Public?</DialogTitle>
          <DialogDescription>
            Would you like to make the trip public? This will allow other users
            to view and save your trip.
          </DialogDescription>
        </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-y-0 space-x-2">
                                <FormControl>
                                <RadioGroupItem value="Y" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Public
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-y-0 space-x-2">
                                <FormControl>
                                <RadioGroupItem value="N" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Private
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="mt-4" type="submit">Save</Button>
                </form>
            </Form>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

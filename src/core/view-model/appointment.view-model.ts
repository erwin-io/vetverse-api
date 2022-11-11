import { Appointment } from "src/shared/entities/Appointment";
import { AppointmentStatusViewModel } from "./appointment-status.view-model";
import { ClientAppointmentViewModel } from "./client-appointment.view-model";
import { ConsultaionTypeViewModel } from "./consultaion-type.view-model";
import { ServiceTypeViewModel } from "./service-type.view-model";
import { StaffViewModel } from "./staff.view-model";

export class AppointmentViewModel {
  appointmentId: string;
  appointmentDate: Date;
  comments: string;
  timeStart: string;
  timeEnd: string;
  isPaid: boolean;
  isWalkIn: boolean;
  walkInAppointmentNotes: string;
  staff: StaffViewModel;
  serviceType: ServiceTypeViewModel;
  consultaionType: ConsultaionTypeViewModel;
  appointmentStatus: AppointmentStatusViewModel;
  payments: any[];
  clientAppointment: ClientAppointmentViewModel;
  petAppointment: any;
  conferencePeerId: string;
  diagnosiAndTreatment: string;
  constructor(model: Appointment | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.appointmentId = model.appointmentId;
    this.appointmentDate = model.appointmentDate;
    this.comments = model.comments;
    this.timeStart = model.timeStart;
    this.timeEnd = model.timeEnd;
    this.isWalkIn = model.isWalkIn;
    this.walkInAppointmentNotes = model.walkInAppointmentNotes;
    this.staff = new StaffViewModel(model.staff);
    this.serviceType = model.serviceType;
    this.consultaionType = model.consultaionType;
    this.appointmentStatus = model.appointmentStatus;
    this.clientAppointment = new ClientAppointmentViewModel(
      model.clientAppointment
    );
    this.petAppointment = model.petAppointment;
    this.payments = model.payments
      ? (<any[]>model.payments).filter((x) => !x.isVoid)
      : [];
    this.isPaid = this.payments.length > 0;
    this.conferencePeerId = model.conferencePeerId;
    this.diagnosiAndTreatment = model.diagnosiAndTreatment;
  }
}

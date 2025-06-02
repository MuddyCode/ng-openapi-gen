import { Operation } from './operation';


export class BaseCrudInterfaceImpl {
  serviceInterface: string;
  intfFunctionName: string;
  isCrud: boolean;

  methodName: string;
  paramsType: string;
  operation: Operation;

  constructor(operation: Operation, resultType: string, methodName: string, paramsType: string) {
    switch (operation.spec.description) {
      case 'baseCreate':
        this.serviceInterface = 'BaseDtoCreateService<' + resultType + '>';
        this.intfFunctionName = 'create';
        break;
      default:
        this.isCrud = false;
        return;
    }

    this.isCrud = true;
    this.methodName = methodName;
    this.operation = operation;
    this.paramsType = paramsType;
  }

}
